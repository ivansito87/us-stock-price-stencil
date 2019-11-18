import { Component, h, State } from "@stencil/core";
import { API_KEY } from "../../global/global";

@Component({
  tag: 'stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})

export class StockFinder {
  stockNameInput: HTMLInputElement;
  @State() searchedResults: { symbol: string, name: string }[] = [];

  onFindStocks = (event: Event): void => {
    event.preventDefault();
    // console.log("event", event);

    function handleErrors(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }

    function parseResponse(response) {
      if (!response) {
        throw Error("no response came from the API call");
      }
      // console.log(response.json());
      return response.json();
    }

    const stockName = this.stockNameInput.value;
    fetch(`http://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${API_KEY}`)
      .then(handleErrors)
      .then(parseResponse)
      .then(res => {
        console.log("res -->", res['bestMatches']);
        this.searchedResults = res['bestMatches'];
        // console.log("this.searchedResults", this.searchedResults);
      })
      .catch(err => console.log(err));
  };

  searchedResultsFunc():HTMLElement[]{
    return this.searchedResults.map(result =>
      <li>Symbol: {result['1. symbol']} Name: {result['2. name']}</li>,
    );
  }
  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input
          type="text"
          id="stocks-finder"
          ref={el => (this.stockNameInput = el)}
          value=""
        />
        <button type="submit">
          Find!
        </button>
      </form>,
      <ul>
        {this.searchedResultsFunc()}
      </ul>
    ];
  }
}
