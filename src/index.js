import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "./styles.css";

class LiveSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      results: {
        items: []
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ searchString: event.target.value });
    if(event.target.value.length < 3) {
      this.setState({ results: {items: []} });
      return;
    }
    axios.get(`http://new.stocvetov.ru/dev/search.php?query_string=${event.target.value}`).then(({ data }) => {
      this.setState({ results: data });
    });
  }

  render() {

    let isHidden = this.state.results.items.length === 4 && this.state.results.total > 7 ? '' : 'hidden';

    let list = '';
    if (this.state.results.items.length > 0) {
      list =
      <ul className="live-search__list">
        {this.state.results.items.map((item, index) => (
          <li key={index} className="live-search__list__item">
            <a href={item.url}>
              <div className="live-search__list__item__image">
                <img alt="" src={`http://new.stocvetov.ru${item.image}`} />
              </div>
              <div className="live-search__list__item__name">{item.name}</div>
              <div className="live-search__list__item__price">{item.price}&nbsp;₽</div>
            </a>
          </li>
        ))}
        <li className={isHidden}>
          <a href="#">Все результаты</a>
        </li>
      </ul>;
    }

    return (
      <div className="live-search__container">
        <input
          className="live-search__input"
          placeholder="Поиск по сайту"
          type="text"
          value={this.state.searchString}
          onChange={this.handleChange}
        />
        <div>
          {list}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("live-search");
ReactDOM.render(<LiveSearchForm />, rootElement);
