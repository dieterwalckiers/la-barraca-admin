import React, { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import {
    ApolloProvider as ApolloHooksProvider,
    useQuery,
} from "@apollo/react-hooks";
import ApolloClientProvider from "./ApolloClientProvider";
import { gql } from "apollo-boost";
import PatchEvent, { set, unset } from "part:@sanity/form-builder/patch-event";
import styles from "./performanceCalendar.css";
import "react-datepicker/dist/react-datepicker.css?raw"; // ?raw is to bybass sanity's css module functionality (https://github.com/sanity-io/sanity/issues/456)

const DEFAULT_LOCATION = "La Barraca";

const createPatchFrom = value =>
    PatchEvent.from(value === "" ? unset() : set(value));

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function toDao(performances) {
    return JSON.stringify(
        performances.map(performance => {
            const { date, time, location, seats } = performance;
            const formattedDate = `${date.getDate()}/${date.getMonth() +
                1}/${date.getFullYear()}`;
            const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
            return {
                date: formattedDate,
                time: formattedTime,
                location,
                seats,
            };
        })
    );
}

function fromDao(performancesDao) {
    console.log("parsing", performancesDao);
    let parseFailed;
    let performances;
    try {
        if (!!performancesDao) {
            performances = JSON.parse(performancesDao);
            performances = performances.reduce((acc, p) => {
                if (!p.date) {
                    return acc;
                }
                const [day, month, year] = p.date.split("/");
                const [hours, minutes] = p.time.split(":");
                const parsedDate = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day)
                );
                const parsedTime = new Date();
                parsedTime.setHours(hours);
                parsedTime.setMinutes(minutes);
                if (!isValidDate(parsedDate)) {
                    return acc;
                }
                const location = p.location || DEFAULT_LOCATION;
                const seats = p.seats || "";
                return acc.concat({ ...p, date: parsedDate, time: parsedTime, location, seats });
            }, []);
        } else {
            parseFailed = true;
        }
    } catch (e) {
        console.error("couldn't parse performances string, error:", e);
        parseFailed = true;
    }
    if (parseFailed) {
        performances = [{ date: new Date(), time: new Date(2000, 0, 1, 20, 0), location: DEFAULT_LOCATION }];
    }
    console.log("performances", performances);
    return performances;
}

const PerformanceCalendar = ({ value, onChange, type }) => {

    const [_locations, _setLocations] = useState({});
    const [_seats, _setSeats] = useState({});
    const [performances, setPerformances] = useState();

    const { data } = useQuery(gql`
        {
            allSiteSettings {
                seats
            }
        }
      `);

    const siteSettings = useMemo(() => data && data.allSiteSettings && data.allSiteSettings.length && [...data.allSiteSettings].pop(), [data])
    const seatsFromSettings = useMemo(() => siteSettings && siteSettings.seats, [siteSettings]);

    useEffect(() => {
        setPerformances(fromDao(value));
    }, [value, setPerformances])

    // // this is called by the form builder whenever this input should receive focus
    // focus() {
    //   this._inputElement.focus();
    // }

    const buildOnChangeLocation = (row) => {
        return (e) => _setLocations({ ..._locations, [row]: e.target.value });
    }

    const buildOnChangeSeats = (row) => {
        return (e) => {
            _setSeats({ ..._seats, [row]: e.target.value });
        }
    }

    const renderPerformanceInput = (performance, i) => {
        console.log("render performance", performance);
        const { date, time, location, seats } = performance;

        const buildOnDateChangeProp = () => {
            return newDate => {
                const updatedPerformances = [...performances];
                updatedPerformances[i].date = newDate;
                onChange(createPatchFrom(toDao(updatedPerformances)));
            };
        };

        const buildOnTimeChangeProp = () => {
            return newTime => {
                console.log("newTime", newTime);
                const updatedPerformances = [...performances];
                updatedPerformances[i].time = newTime;
                onChange(createPatchFrom(toDao(updatedPerformances)));
            };
        };

        const buildOnLocationBlurProp = (row) => {
            return e => {
                const newLocation = e.target.value;
                console.log("newLocation", newLocation);
                const updatedPerformances = [...performances];
                updatedPerformances[i].location = newLocation;
                onChange(createPatchFrom(toDao(updatedPerformances)));
                _setLocations({ ..._locations, [row]: undefined });
            };
        }
        const buildOnSeatsBlurProp = (row) => {
            return e => {
                const newSeats = e.target.value;
                const updatedPerformances = [...performances];
                updatedPerformances[i].seats = isNaN(parseInt(newSeats)) ? undefined : newSeats;
                onChange(createPatchFrom(toDao(updatedPerformances)));
                _setSeats({ ..._seats, [row]: undefined });
            };
        }

        const seatsValue = (_seats[i] === undefined ? seats : _seats[i]) || "";

        return (
            <div className={styles.perfRow} key={`perfinput${date}${time}${i}`}>
                <DatePicker
                    selected={date}
                    onChange={buildOnDateChangeProp()}
                    dateFormat="dd-MM-yyyy"
                    className={styles.datepicker}
                />
                <DatePicker
                    selected={time}
                    onChange={buildOnTimeChangeProp()}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    className={styles.timepicker}
                />
                <input type="text" value={_locations[i] || location} onChange={buildOnChangeLocation(i)} onBlur={buildOnLocationBlurProp(i)} className={styles.locationInput} />
                <span title="aantal plaatsen">pl.:</span>
                <input placeholder={seatsFromSettings || ""} value={seatsValue} onChange={buildOnChangeSeats(i)} onBlur={buildOnSeatsBlurProp(i)} className={styles.seatsInput} />
                <button onClick={buildOnDelete(i)}>wis</button>
            </div>
        );
    }

    const buildOnDelete = (i) => {
        return () => {
            onChange(
                createPatchFrom(toDao(performances.filter((_, pos) => pos !== i)))
            );
        };
    }

    const buildOnNew = () => {
        return () => {
            const [lastDate, lastSeats] =
                !!(performances.length) ? [
                    performances[performances.length - 1].date,
                    performances[performances.length - 1].seats,
                ] : [undefined, undefined];
            const newDate = lastDate
                ? new Date(
                    lastDate.getFullYear(),
                    lastDate.getMonth(),
                    lastDate.getDate() + 1
                )
                : new Date();
            onChange(
                createPatchFrom(
                    toDao(
                        performances.concat({
                            date: newDate,
                            time: new Date(2000, 0, 1, 20, 0),
                            location: DEFAULT_LOCATION,
                            seats: lastSeats,
                        })
                    )
                )
            );
        };
    }

    const renderNewBtn = () => {
        return (
            <div>
                <button onClick={buildOnNew()}>Voorstelling toevoegen</button>
            </div>
        );
    }


    return !performances ? (
        "loading"
    ) : (
        <div>
            <h2>{type.title}</h2>
            {performances.map(renderPerformanceInput)}
            {renderNewBtn()}
        </div>
    );
}

export default class PerformanceCalendarWrapper extends React.Component {
    render() {
        return (
            <ApolloClientProvider>
                {(apolloClient) => {
                    console.log("render children with", apolloClient);
                    return apolloClient ? (
                        <ApolloHooksProvider client={apolloClient}>
                            <PerformanceCalendar {...this.props} />
                        </ApolloHooksProvider>
                    ) : (
                        "loading"
                    );
                }}
            </ApolloClientProvider>
        );
        // return (
        //     <PerformanceCalendar {...this.props} />
        // );
    }

}
