import * as React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import {
  addDays,
  isSameDay,
  endOfMonth,
  startOfWeek,
  subDays,
  startOfMonth,
  getDaysInMonth,
  getMonth,
  parse
} from "date-fns";
import CalendarDate from "./CalendarDate";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface IProps {
  files: any;
}

interface IState {
  dates: Date[];
  datesToShow: Date[][];
}

class Calendar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    let day = startOfMonth(new Date());
    const end = endOfMonth(day);
    const count = getDaysInMonth(day);
    const days = [];

    // Start from beginning of week
    while (!isSameDay(day, startOfWeek(day))) {
      day = subDays(day, 1);
    }

    // Go until end of month
    while (!isSameDay(day, end)) {
      days.push(day);
      day = addDays(day, 1);
    }
    const dates = days.slice();
    const daysWeekified = this.chunkArray(days, 7);
    this.state = { dates, datesToShow: daysWeekified };
    // this.getFolderIds = this.getFolderIds.bind(this);
  }
  public render() {
    const { datesToShow } = this.state;
    return (
      <Paper>
        {datesToShow.map((week: Date[]) => (
          <Grid
            key={week.length + week[0].toLocaleDateString()}
            container={true}
            spacing={16}
          >
            {week.map((day: Date) => (
              <Grid key={day.toLocaleDateString()} item={true}>
                <CalendarDate day={day} />
              </Grid>
            ))}
          </Grid>
        ))}
      </Paper>
    );
  }
  private chunkArray(myArray: Date[], chunk_size: number) {
    var results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  }
}

const mapState = (state: any) => {
  return {
    files: state.files
  };
};
export default connect(mapState)(Calendar);
