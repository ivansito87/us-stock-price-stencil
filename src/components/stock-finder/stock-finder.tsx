import { Component, h, State, Event } from "@stencil/core";
import { API_KEY } from "../../global/global";
import { EventEmitter } from "events";

@Component({
  tag: "stock-finder",
  styleUrl: "./stock-finder.css",
  shadow: true
})
export class StockFinder {
  stockNameInput: HTMLInputElement;
  // defining state to be a list of objects and every object has a
  // property symbol that is a string and name that is a string
  @State() searchedResults: { symbol: string; name: string }[] = [];
  @State() loading: boolean = false;
  @Event({
    bubbles: true,
    composed: true,
    eventName: "usSymbolSelected"
  })
  usSymbolSelected: EventEmitter;

  onFindStocks = (event: Event): void => {
    (event as Event).preventDefault();
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
    this.loading = true;
    fetch(
      `http://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${API_KEY}`
    )
      .then(handleErrors)
      .then(parseResponse)
      .then(res => {
        // console.log("res -->", res["bestMatches"]);
        this.searchedResults = res["bestMatches"];
        this.loading = false;
        // console.log("this.searchedResults", this.searchedResults);
      })
      .catch(err => console.log(err));
    this.loading = false;
  };

  searchedResultsFunc(): HTMLElement[] {
    return this.searchedResults.map(result => (
      <ul>
        {" "}
        <li onClick={this.onSelectSymbol.bind(this, result["1. symbol"])}>
          Symbol: {result["1. symbol"]} Name: {result["2. name"]}
        </li>
      </ul>
    ));
  }

  onSelectSymbol(symbol: string) {
    // console.log(symbol);
    this.usSymbolSelected.emit(symbol);
  }

  render() {
    let content:any = this.searchedResultsFunc();
    if (this.loading) {
      content = <uc-spinner />;
    }
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input
          type="text"
          id="stocks-finder"
          ref={el => (this.stockNameInput = el)}
          value=""
        />
        <button type="submit">Find!</button>
      </form>,
      content
    ];
  }
}
