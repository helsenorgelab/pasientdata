import "./goalContent.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import ChangeGoalButton from "../../../Components/ChangeGoalButton/changeGoalButton";
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from "recharts";
import CardComponent from "../../../Components/Card/cardComponent";
import FakeGlucoseData from "../../../Utils/fakeGlucose";
import Trends from "../../../Utils/trends";
import { getAggregatedDataForDataType } from "../../../Utils/aggregatedDataForDataType";
import {
  STEPS,
  WEIGHT,
  BLOODSUGAR,
  PHYSICAL_ACTIVITY,
  CARBOHYDRATES
} from "../../../dataTypes";

class GoalContent extends Component {
  CustomLabel(value1, value2, xPos) {
    return (
      <text dominantBaseline="central">
        <tspan x={65} y={70} alignmentBaseline="middle" fontSize="16">
          {value1}
        </tspan>
        <tspan x={xPos} y={90} alignmentBaseline="middle" fontSize="18">
          {value2}
        </tspan>
      </text>
    );
  }

  displayUnit = () => {
    switch (this.props.datatype) {
      case "Blodsukker":
        return "/dag";
      case "BlodsukkerAvg":
        return "mmol/l";
      case "skritt/dag":
        return "skritt";
      case "Vekt":
        return "kilogram";
      case "FysiskAktivitet":
        return "min/uke";
      case "Karbohydrater":
        return "gram/dag";
      case "Blodtrykk":
        return "mmHg/dag";
      default:
        return "Default";
    }
  };

  goalContent = () => {
    let generalColors = ["#E38B21", "#EEE05D", "#569B7E", "#EEE05D", "#E38B21"];
    let overColors = ["#E38B21", "#EEE05D", "#569B7E"];
    let underColors = ["#569B7E", "#EEE05D", "#E38B21"];
    let COLORS = [];
    let dataSet = [
      { value: 1 },
      { value: 1 },
      { value: 1 },
      { value: 1 },
      { value: 1 }
    ];

    let xPos;
    let data = FakeGlucoseData();
    let upperLimit = 12;
    let lowerLimit = 5;
    let goalValue = "undefined";
    let { mean, timeAbove, timeWithin, timeBelow } = Trends(
      data,
      upperLimit,
      lowerLimit
    );
    let currentValue =
      (timeWithin * 100) / (timeAbove + timeWithin + timeBelow);
    let unit = "%";
    let trends;

    switch (this.props.datatype) {
      case "Blodsukker":
        COLORS = overColors;
        dataSet = [{ value: 1 }, { value: 1 }, { value: 3 }];
        goalValue = this.props.patient.goals.BloodSugarWithinRangePercentageGoal
          .value;
        xPos = 72;
        data = getAggregatedDataForDataType(
          this.props.baseInfo,
          this.props.patient.datasets,
          BLOODSUGAR,
          "goal"
        );
        upperLimit = goalValue;
        lowerLimit = goalValue / 5;
        currentValue =
          (timeWithin * 100) / (timeAbove + timeWithin + timeBelow);
        unit = "%";
        break;
      case "BlodsukkerAvg":
        COLORS = generalColors;
        goalValue = this.props.patient.goals.MeanGlucoseGoal.value;
        unit = "mmol/l";
        xPos = 51;
        data = getAggregatedDataForDataType(
          this.props.baseInfo,
          this.props.patient.datasets,
          BLOODSUGAR,
          "goal"
        );
        upperLimit = goalValue * 2;
        lowerLimit = goalValue / 2;
        trends = Trends(data, upperLimit, lowerLimit);
        mean = trends.mean;
        currentValue = mean;
        break;
      case "Skritt":
        COLORS = overColors;
        dataSet = [{ value: 1 }, { value: 1 }, { value: 3 }];
        goalValue = this.props.patient.goals.StepsGoal.value;
        xPos = 48;
        data = this.props.patient.datasets[0].measurements;
        upperLimit = goalValue;
        lowerLimit = goalValue / 5;
        let aggregated = getAggregatedDataForDataType(
          this.props.baseInfo,
          this.props.patient.datasets,
          STEPS,
          "goal"
        );
        trends = Trends(aggregated, upperLimit, lowerLimit);
        mean = trends.mean;
        currentValue = mean;
        unit = "skritt";
        break;
      case "Vekt":
        dataSet = [{ value: 2 }, { value: 2 }, { value: 1 }];
        COLORS = underColors;
        goalValue = this.props.patient.goals.WeightGoal.value;
        unit = "kg";
        xPos = 67;
        data = getAggregatedDataForDataType(
          this.props.baseInfo,
          this.props.patient.datasets,
          WEIGHT,
          "goal"
        );
        upperLimit = goalValue;
        lowerLimit = goalValue / 5;
        trends = Trends(data, upperLimit, lowerLimit);
        mean = trends.mean;
        currentValue = mean;
        break;
      case "FysiskAktivitet":
        COLORS = overColors;
        dataSet = [{ value: 1 }, { value: 1 }, { value: 3 }];
        goalValue = this.props.patient.goals.PhysicalActivityGoal.value;
        unit = "min";
        xPos = 58;
        data = getAggregatedDataForDataType(
          this.props.baseInfo,
          this.props.patient.datasets,
          PHYSICAL_ACTIVITY,
          "goal"
        );
        let activeMin = 0;
        for (let i = 0; i < data.length; i++) {
          activeMin += data[i].y;
        }
        upperLimit = goalValue;
        lowerLimit = goalValue / 5;
        currentValue = activeMin;
        break;
      case "Karbohydrater":
        COLORS = generalColors;
        goalValue = this.props.patient.goals.CarbsGoal.value;
        unit = "g";
        xPos = 70;
        data = getAggregatedDataForDataType(
          this.props.baseInfo,
          this.props.patient.datasets,
          CARBOHYDRATES,
          "goal"
        );
        upperLimit = goalValue;
        lowerLimit = goalValue / 5;
        break;
      default:
        return;
    }

    let arrowAngle;

    if (currentValue < lowerLimit) {
      arrowAngle = (-40 + (currentValue - lowerLimit) * 220) * (Math.PI / 180);
    } else if (currentValue > upperLimit) {
      arrowAngle = (-40 + (currentValue - upperLimit) * -40) * (Math.PI / 180);
    } else {
      arrowAngle =
        (-40 +
          ((currentValue - lowerLimit) / (currentValue - upperLimit)) * 260) *
        (Math.PI / 180);
    }

    let triangleAngle = (70 * Math.PI) / 180;
    let r = 20;
    let theta = 9;
    let radius = 45;

    let centerX = 87.5 + radius * Math.cos(-arrowAngle);
    let centerY = 80 + radius * Math.sin(-arrowAngle);
    let x1 = Math.floor(centerX + r * Math.cos(-arrowAngle));
    let y1 = Math.floor(centerY + r * Math.sin(-arrowAngle));
    let x2 = Math.floor(
      centerX + theta * Math.cos(-arrowAngle - triangleAngle)
    );
    let y2 = Math.floor(
      centerY + theta * Math.sin(-arrowAngle - triangleAngle)
    );
    let x3 = Math.floor(
      centerX + theta * Math.cos(-arrowAngle + triangleAngle)
    );
    let y3 = Math.floor(
      centerY + theta * Math.sin(-arrowAngle + triangleAngle)
    );

    let pointString = x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3;

    return (
      <div className="flex-container-trend-goals outer-div-trend-goals">
        <div className="split">
          <div className="circleBound">
            <div className="goalText">Mål:</div>
            <div className="goalPercentText">{goalValue}</div>
            <div className="unitText">{this.displayUnit()}</div>
          </div>
        </div>
        <div className="row split rowStyle">
          <div className="pieChartStyle">
            <ResponsiveContainer
              className="flex-children-trend-goals"
              width={175}
              height={160}
            >
              <PieChart>
                <Pie
                  data={dataSet}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={80}
                  startAngle={220}
                  endAngle={-40}
                  fill="#8884d8"
                >
                  {dataSet.map((entry, index) => (
                    <Cell key="" fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label
                    position="center"
                    content={this.CustomLabel(
                      "Status: ",
                      Math.floor(currentValue) + " " + unit,
                      xPos
                    )}
                  />
                </Pie>
                <svg>
                  <polygon
                    points={pointString}
                    fill="#4F4F4F"
                    className="trend-polygon"
                  />
                </svg>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="button-style">
              <ChangeGoalButton datatype={this.props.datatype} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <CardComponent title={this.props.title} content={this.goalContent()} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient: state.patient,
    baseInfo: state.baseInfo
  };
}

export default connect(mapStateToProps)(GoalContent);
