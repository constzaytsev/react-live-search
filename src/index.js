import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import "./styles.css";

class LiveSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      results: [],
      showResults: "hidden"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ searchString: event.target.value });
    axios.get(`http://new.stocvetov.ru/dev/search.php?query_string=${event.target.value}`).then(({ data }) => {
      this.setState({ showResults: 'shown' });
      this.setState({ results: data.results });
    });
  }

  render() {

    let list = '';
    if (this.state.results.length > 0) {
      list =
      <ul>
      <ReactCSSTransitionGroup transitionName="example">
        {this.state.results.map((item, index) => (
          <li key={index}>
            <img src={`http://new.stocvetov.ru${item.image}`} width="80" />
            {item.name}
          </li>
        ))}
        </ReactCSSTransitionGroup>
      </ul>;
    }
    return (
      <div>
        <input
          type="text"
          value={this.state.searchString}
          onChange={this.handleChange}
        />
        <div className={this.state.showResults}>
        {list}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<LiveSearchForm />, rootElement);
