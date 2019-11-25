import {
  Component,
  h,
  State,
  Element,
  Prop,
  Watch,
  Listen
} from "@stencil/core";
import { API_KEY } from "../../global/global";

@Component({
  tag: "us-stock-price",
  styleUrl: "./us-stock-price.css",
  shadow: true
})
export class UsStockPrice {
  @Element() el: HTMLElement;
  @State() fetchedPrices: number;
  @State() value: string;
  @State() stockUserInput: string;
  @State() stockUserInputValid: boolean;
  @State() error: string;
  @State() loading: boolean;

  @Prop({ mutable: true, reflectToAttr: true }) stockSymbol: string;

  @Watch("stockSymbol")
  stockSymbolChangeWatch(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }

  stockInput: HTMLInputElement;
  // initialStockSymbol: string;

  private onfetchDataFromStocks = (event: Event): void => {
    event.preventDefault();

    /* This are the same which ever approach you use will be fine */
    // const stockSymbol:string = (this.el.shadowRoot.querySelector('#stocks-input') as HTMLElement).nodeValue;
    // const stockSymbol = this.stockInput.value;
    this.stockSymbol = this.stockInput.value;
  };

  onUserInput = (event: Event): void => {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockUserInputValid = this.stockUserInput.trim() !== "";
    // this.fetchStockPrice(this.stockUserInput);
  };

  // this will be used instead of the HTMLInputElement
  handleChange(event) {
    this.value = event.target.value;
    // console.log(this.value);
  }

  componentWillLoad() {
    // console.log("componentWillLoead", this.stockSymbol);
  }

  componentDidLoad() {
    if (this.stockSymbol) {
      // this.initialStockSymbol = this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.stockUserInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    // console.log("componentWillUpdate");
  }

  componentDidUpdate() {
    // if (this.stockSymbol !== this.initialStockSymbol) {
    //   this.fetchStockPrice(this.stockSymbol)
    // }
    // console.log("componentDidUpdate");
  }

  componentDidUnload() {
    // console.log("componentDidUnload");
  }

  @Listen("usSymbolSelected", {
    target: "body"
  })
  onStockSymbolSelectFromUsStockSymbol(event: CustomEvent) {
    if (event.detail && event.detail !== this.stockSymbol) {
      console.log("Received the custom todoCompleted event: ", event.detail);
      this.stockUserInput = event.detail;
      this.fetchStockPrice(event.detail);
    }
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;
    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`
    )
      .then(response => {
        if (response.status !== 200) {
          throw new Error("Oh snap! The promise wasn't fulfilled");
        }
        return response.json();
      })
      .then(responseParsed => {
        if (!responseParsed["Global Quote"]["05. price"]) {
          throw new Error("Uh oh, empty response");
        }
        this.fetchedPrices = +responseParsed["Global Quote"]["05. price"];
        this.loading = false;
      })
      .catch(err => {
        err ? (this.error = "Invalid input") : "";
        this.fetchedPrices = null;
        this.loading = false;
      });
  }

  // adding classes to the host element dinamically when the error is true
  // it connects with the  from css :host(.error) {}
  // is xecuted when render is wscecuted and when the state or properies of the
  // components change
  // hostData() {
  //   return { class: this.error ? "error" : "" };
  // }

  render() {
    let dataContent = <p>Please enter a stock name</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }
    if (this.fetchedPrices) {
      dataContent = <p>Price: ${this.fetchedPrices}</p>;
    }
    if (this.loading) {
      dataContent = <uc-spinner />;
    }
    return [
      <form onSubmit={this.onfetchDataFromStocks.bind(this)}>
        <input
          type="text"
          id="stocks-input"
          ref={el => (this.stockInput = el)}
          value={this.stockUserInput}
          onInput={this.onUserInput.bind(this)}
        />
        <button
          type="submit"
          disabled={!this.stockUserInputValid || this.loading}
        >
          Fetch
        </button>
      </form>,
      <div>{dataContent}</div>
    ];
  }
}
