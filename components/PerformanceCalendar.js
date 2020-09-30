import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

import PatchEvent, { set, unset } from "part:@sanity/form-builder/patch-event";
import styles from "./performanceCalendar.css";

const DEFAULT_LOCATION = "La Barraca";

const createPatchFrom = value =>
  PatchEvent.from(value === "" ? unset() : set(value));

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function toDao(performances) {
  return JSON.stringify(
    performances.map(performance => {
      const { date, time, location } = performance;
      const formattedDate = `${date.getDate()}/${date.getMonth() +
        1}/${date.getFullYear()}`;
      const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
      return {
        date: formattedDate,
        time: formattedTime,
        location
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
        return acc.concat({ ...p, date: parsedDate, time: parsedTime, location });
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

export default class PerformanceCalendar extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string
      // options: PropTypes.shape({
      //   min: PropTypes.number.isRequired,
      //   max: PropTypes.number.isRequired,
      //   step: PropTypes.number
      // }).isRequired
    }).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.renderPerformanceInput = this.renderPerformanceInput.bind(this);
    this.renderNewBtn = this.renderNewBtn.bind(this);
    this.buildOnNew = this.buildOnNew.bind(this);
    this.buildOnDelete = this.buildOnDelete.bind(this);
    this.state = {
      _locations: {},
    };
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      performances: fromDao(value)
    });
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    const { value: prevValue } = prevProps;
    if (prevValue !== value) {
      this.setState({
        performances: fromDao(value)
      });
    }
  }

  // this is called by the form builder whenever this input should receive focus
  focus() {
    this._inputElement.focus();
  }

  buildOnChangeLocation(row) {
    const { _locations } = this.state;
    return (e) => this.setState({ _locations: { ..._locations, [row]: e.target.value } });
  }

  renderPerformanceInput(performance, i) {
    console.log("render performance", performance);
    const { date, time, location } = performance;
    const { onChange } = this.props;
    const { performances, _locations } = this.state;

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
      const { _locations } = this.state;
      return e => {
        const newLocation = e.target.value;
        console.log("newLocation", newLocation);
        const updatedPerformances = [...performances];
        updatedPerformances[i].location = newLocation;
        onChange(createPatchFrom(toDao(updatedPerformances)));
        this.setState({
          _locations: { ..._locations, [row]: undefined }
        });
      };
    }

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
        <input type="text" value={_locations[i] || location} onChange={this.buildOnChangeLocation(i)} onBlur={buildOnLocationBlurProp(i)} className={styles.locationInput} />
        <button onClick={this.buildOnDelete(i)}>verwijder</button>
      </div>
    );
  }

  buildOnDelete(i) {
    return () => {
      const { performances } = this.state;
      const { onChange } = this.props;
      onChange(
        createPatchFrom(toDao(performances.filter((_, pos) => pos !== i)))
      );
    };
  }

  buildOnNew() {
    return () => {
      const { performances } = this.state;
      const { onChange } = this.props;
      const lastDate =
        !!performances.length && performances[performances.length - 1].date;
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
              location: DEFAULT_LOCATION
            })
          )
        )
      );
    };
  }

  renderNewBtn() {
    return (
      <div>
        <button onClick={this.buildOnNew()}>Voorstelling toevoegen</button>
      </div>
    );
  }

  render() {
    const { type } = this.props;
    const { performances } = this.state;

    return !performances ? (
      "loading"
    ) : (
        <div>
          <h2>{type.title}</h2>
          {performances.map(this.renderPerformanceInput)}
          {this.renderNewBtn()}
        </div>
      );
  }
}
