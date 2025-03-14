import React, { Component } from "react";
import "./menuBar.css";
import Menu from "@helsenorge/toolkit/components/icons/Menu";
import Tiles from "@helsenorge/toolkit/components/icons/Tiles";
import ChevronDownRounded from "@helsenorge/toolkit/components/icons/ChevronDownRounded";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { onLoggedIn } from "../../Redux/actions";

/*
 * The menu bar at the top of the page.
 */

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: false, isToggleOn2: false };
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.loggedOut = this.loggedOut.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  toggle2() {
    this.setState(prevState => ({
      isToggleOn2: !prevState.isToggleOn2
    }));
  }

  loggedOut() {
    sessionStorage.removeItem("googleResponse");
    this.props.onLoggedIn(false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.isToggleOn) {
        this.toggle();
      }
      if (this.state.isToggleOn2) {
        this.toggle2();
      }
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    let menu;
    let menu2;

    // Tried to make a inner dropdown, does not work with flipped horizontal view,
    // and does not close outer dropdown when clicked on inner buttons

    if (this.state.isToggleOn2) {
      menu2 = (
        <div className="menuBar2 menuBar-open2">
          <ul className="ulBar">
            <li className="liBar2 libar2-items">
              <NavLink
                to="/bloodsugar"
                className="menu-link2 click-menuBar-open2"
                onClick={() => {
                  this.toggle2();
                  this.toggle();
                }}
              >
                Blodsukker
              </NavLink>
            </li>
            <li className="liBar2 libar2-items">
              <NavLink
                to="/insulin"
                className="menu-link2 click-menuBar-open2"
                onClick={() => {
                  this.toggle2();
                  this.toggle();
                }}
              >
                Insulin
              </NavLink>
            </li>
            <li className="liBar2 libar2-items">
              <NavLink
                to="/steps"
                className="menu-link2 click-menuBar-open2"
                onClick={() => {
                  this.toggle2();
                  this.toggle();
                }}
              >
                Skritt
              </NavLink>
            </li>
            <li className="liBar2 libar2-items">
              <NavLink
                to="/weight"
                className="menu-link2 click-menuBar-open2"
                onClick={() => {
                  this.toggle2();
                  this.toggle();
                }}
              >
                Vekt
              </NavLink>
            </li>
            <li className="liBar2 libar2-items">
              <NavLink
                to="/physicalactivity"
                className="menu-link2 click-menuBar-open2"
                onClick={() => {
                  this.toggle2();
                  this.toggle();
                }}
              >
                Fysisk aktivitet
              </NavLink>
            </li>
            <li className="liBar2 libar2-items">
              <NavLink
                to="/carbohydrates"
                className="menu-link2 click-menuBar-open2"
                onClick={() => {
                  this.toggle2();
                  this.toggle();
                }}
              >
                Karbohydrater
              </NavLink>
            </li>
          </ul>
        </div>
      );
    } else {
      menu2 = <div className="menuBar2"> </div>;
    }

    if (this.state.isToggleOn) {
      const menuBar2OpenStyle = {
        height: "auto",
        padding: "12px 16px 4px 44px"
      };
      menu = (
        <div className="menuBar menuBar-open pageLink">
          <ul className="ulBar">
            <li className="liBar">
              <div className="minHelse">
                <Tiles color="black" />{" "}
                <span className="smallMarginLeft">Min helse</span>
              </div>
            </li>
            <li
              className="liBar libar-items"
              style={this.state.isToggleOn2 ? menuBar2OpenStyle : {}}
            >
              <NavLink
                to="/dashboard"
                className="menu-link click-menuBar-open"
                onClick={this.toggle}
              >
                Innsikt
              </NavLink>
              <button className="button2" onClick={this.toggle2}>
                <ChevronDownRounded
                  className="menuButton2"
                  color="blue"
                  style={
                    this.state.isToggleOn2
                      ? { transform: "rotate(180deg)" }
                      : {}
                  }
                />
              </button>
              {menu2}
            </li>
            <li className="liBar libar-items">
              <NavLink
                to="/comparedata"
                className="menu-link click-menuBar-open"
                onClick={this.toggle}
              >
                Sammenlign data
              </NavLink>
            </li>
            <li className="liBar libar-items">
              <NavLink
                to="/mygoals"
                className="menu-link click-menuBar-open"
                onClick={this.toggle}
              >
                Sett mål
              </NavLink>
            </li>
            <li className="liBar libar-items">
              <span className="logoutButton" onClick={() => this.loggedOut()}>
                Logg ut
              </span>
            </li>
          </ul>
        </div>
      );
    } else {
      menu = <div className="menuBar"> </div>;
    }

    return (
      <div>
        <div ref={this.setWrapperRef}>
          <div className="bar navbar">
            <div className="menuPos textStyle">
              <Link className="aStyle" to="/dashboard">
                Helseinnsikt
              </Link>
            </div>
            <div className="menuPos">
              <button className="button" onClick={this.toggle}>
                <Menu /> Meny
              </button>
            </div>
          </div>
          <div>{menu}</div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = { onLoggedIn };

function mapStateToProps(state) {
  return {
    patient: state.patient
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuBar);