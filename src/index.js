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
    this.handleEnter = this.handleEnter.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ results: {items: []} });
    }
  }

  handleChange(event) {
    this.setState({ searchString: event.target.value });
    if(event.target.value.length < 3) {
      this.setState({ results: {items: []} });
      return;
    }
    axios.get(`/dev/search.php?query_string=${event.target.value}`).then(({ data }) => {
      this.setState({ results: data });
    });
  }

  handleEnter(event) {
    if (event.keyCode === 13) {
      window.location.href = `/catalog-of-product/?search_string=${this.state.searchString}`;
    }
  }

  render() {

    let isHidden = this.state.results.items.length === 4 && this.state.results.total > 4 ? '' : 'hidden';

    let list = '';
    if (this.state.results.items.length > 0) {
      list =
      <ul className="live-search__list">
        {this.state.results.items.map((item, index) => (
          <li key={index} className="live-search__list__item">
            <a href={item.url}>
              <div className="live-search__list__item__image">
                <img alt="" src={item.image} />
              </div>
              <div className="live-search__list__item__name">{item.name}</div>
              <div className="live-search__list__item__price">{item.price}&nbsp;₽</div>
            </a>
          </li>
        ))}
        <li className={isHidden}>
          <a href={`/catalog-of-product/?search_string=${this.state.searchString}`}>Все результаты</a>
        </li>
      </ul>;
    }

    return (
      <div className="live-search__container" ref={this.setWrapperRef}>
        <input
          className="search__string"
          placeholder="Поиск по сайту..."
          type="text"
          name="search_string"
          value={this.state.searchString}
          onChange={this.handleChange}
          onKeyUp={this.handleEnter}
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
