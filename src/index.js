import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNum: "",
      captcha: "",
      time: 60,
      badNum: false,
      sendReq: false
    };
  }

  handleNumberChange = e => {
    this.setState({
      phoneNum: e.target.value,
      badNum: false
    });
  };

  onClick = () => {
    const reg = /[0-9]{11}/;
    if (reg.test(this.state.phoneNum)) {
      this.setState({
        badNum: false,
        sendReq: true
      });
      this.requestCapthca();
    } else {
      this.setState({
        badNum: true,
        sendReq: false
      });
    }
  };

  requestCapthca() {
    this.timeId = setInterval(() => {
      if (this.state.time !== 0) {
        this.setState({
          time: this.state.time - 1
        });
      } else {
        clearInterval(this.timeId);
        this.setState({
          sendReq: false,
          time: 60
        });
      }
    }, 1000);
    fetch("https://easy-mock.com/mock/5b2385e3debe3c5977248a16/wscn/captcha")
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) {
          this.setState({
            captcha: res.data.captcha,
            time: 60,
            sendReq: false
          });
          clearInterval(this.timeId);
        }
      })
      .then(() => {
        const body = {
          phone: this.state.phoneNum,
          captcha: this.state.captcha
        };
        fetch(
          "https://easy-mock.com/mock/5b2385e3debe3c5977248a16/wscn/submit",
          {
            method: "POST",
            body
          }
        ).then(() => {
          console.log("done");
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { badNum, sendReq, phoneNum, captcha } = this.state;

    return (
      <div>
        <div style={{ margin: 10 }}>
          手机号：{" "}
          <input
            type="text"
            value={phoneNum}
            onChange={this.handleNumberChange}
          />
          {badNum ? <span>错误的号码</span> : null}
        </div>
        <input type="text" placeholder="验证码" value={captcha} />
        <button onClick={this.onClick} disabled={this.state.sendReq}>
          {this.state.sendReq ? `重发验证码${this.state.time}` : "获取验证码"}
        </button>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Login />, rootElement);
