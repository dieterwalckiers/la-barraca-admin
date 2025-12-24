import React, { useEffect, useState, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import { set, unset, StringInputProps } from "sanity";
import ApolloClientProvider from "./ApolloClientProvider";
import gql from "graphql-tag";
import styles from "./performanceCalendar.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@apollo/client";

const DEFAULT_LOCATION = "La Barraca";

interface Performance {
  date: Date;
  time: Date;
  location: string;
  seats?: string;
}

interface PerformanceDao {
  date: string;
  time: string;
  location?: string;
  seats?: string;
}

function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

function toDao(performances: Performance[]): string {
  return JSON.stringify(
    performances.map(performance => {
      const { date, time, location, seats } = performance;
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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

function fromDao(performancesDao: string | undefined): Performance[] {
  console.log("parsing", performancesDao);
  let parseFailed = false;
  let performances: Performance[] = [];

  try {
    if (performancesDao) {
      const parsed: PerformanceDao[] = JSON.parse(performancesDao);
      performances = parsed.reduce((acc: Performance[], p) => {
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
        parsedTime.setHours(parseInt(hours));
        parsedTime.setMinutes(parseInt(minutes));
        if (!isValidDate(parsedDate)) {
          return acc;
        }
        const location = p.location || DEFAULT_LOCATION;
        const seats = p.seats || "";
        return acc.concat({ date: parsedDate, time: parsedTime, location, seats });
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

const PerformanceCalendar = (props: StringInputProps) => {
  const { value, onChange, schemaType } = props;

  const [_locations, _setLocations] = useState<Record<number, string>>({});
  const [_seats, _setSeats] = useState<Record<number, string>>({});
  const [performances, setPerformances] = useState<Performance[]>();

  const { data } = useQuery(gql`
    {
      allSiteSettings {
        seats
      }
    }
  `);

  const siteSettings = useMemo(
    () => data?.allSiteSettings?.[data.allSiteSettings.length - 1],
    [data]
  );
  const seatsFromSettings = useMemo(
    () => siteSettings?.seats,
    [siteSettings]
  );

  useEffect(() => {
    setPerformances(fromDao(value));
  }, [value, setPerformances]);

  const handleChange = useCallback((newValue: string) => {
    onChange(newValue === "" ? unset() : set(newValue));
  }, [onChange]);

  const buildOnChangeLocation = (row: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => _setLocations({ ..._locations, [row]: e.target.value });
  };

  const buildOnChangeSeats = (row: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      _setSeats({ ..._seats, [row]: e.target.value });
    };
  };

  const buildOnDelete = (i: number) => {
    return () => {
      if (!performances) return;
      handleChange(toDao(performances.filter((_, pos) => pos !== i)));
    };
  };

  const renderPerformanceInput = (performance: Performance, i: number) => {
    if (!performances) return null;

    console.log("render performance", performance);
    const { date, time, location, seats } = performance;

    const buildOnDateChangeProp = () => {
      return (newDate: Date | null) => {
        if (!newDate) return;
        const updatedPerformances = [...performances];
        updatedPerformances[i].date = newDate;
        handleChange(toDao(updatedPerformances));
      };
    };

    const buildOnTimeChangeProp = () => {
      return (newTime: Date | null) => {
        if (!newTime) return;
        console.log("newTime", newTime);
        const updatedPerformances = [...performances];
        updatedPerformances[i].time = newTime;
        handleChange(toDao(updatedPerformances));
      };
    };

    const buildOnLocationBlurProp = (row: number) => {
      return (e: React.FocusEvent<HTMLInputElement>) => {
        const newLocation = e.target.value;
        console.log("newLocation", newLocation);
        const updatedPerformances = [...performances];
        updatedPerformances[i].location = newLocation;
        handleChange(toDao(updatedPerformances));
        _setLocations({ ..._locations, [row]: undefined as unknown as string });
      };
    };

    const buildOnSeatsBlurProp = (row: number) => {
      return (e: React.FocusEvent<HTMLInputElement>) => {
        const newSeats = e.target.value;
        const updatedPerformances = [...performances];
        updatedPerformances[i].seats = isNaN(parseInt(newSeats)) ? undefined : newSeats;
        handleChange(toDao(updatedPerformances));
        _setSeats({ ..._seats, [row]: undefined as unknown as string });
      };
    };

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
        <input
          type="text"
          value={_locations[i] || location}
          onChange={buildOnChangeLocation(i)}
          onBlur={buildOnLocationBlurProp(i)}
          className={styles.locationInput}
        />
        <span title="aantal plaatsen">pl.:</span>
        <input
          placeholder={seatsFromSettings || ""}
          value={seatsValue}
          onChange={buildOnChangeSeats(i)}
          onBlur={buildOnSeatsBlurProp(i)}
          className={styles.seatsInput}
        />
        <button onClick={buildOnDelete(i)}>wis</button>
      </div>
    );
  };

  const buildOnNew = () => {
    return () => {
      if (!performances) return;
      const [lastDate, lastSeats] =
        performances.length ? [
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
      handleChange(
        toDao(
          performances.concat({
            date: newDate,
            time: new Date(2000, 0, 1, 20, 0),
            location: DEFAULT_LOCATION,
            seats: lastSeats,
          })
        )
      );
    };
  };

  return !performances ? (
    <div>loading</div>
  ) : (
    <div>
      <h2>{schemaType.title}</h2>
      {performances.map(renderPerformanceInput)}
      <button onClick={buildOnNew()}>Voorstelling toevoegen</button>
    </div>
  );
};

const PerformanceCalendarWrapper = (props: StringInputProps) => {
  return (
    <ApolloClientProvider>
      <PerformanceCalendar {...props} />
    </ApolloClientProvider>
  );
};

export default PerformanceCalendarWrapper;
