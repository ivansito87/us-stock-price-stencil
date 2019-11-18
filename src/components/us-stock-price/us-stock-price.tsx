import { Component, h, State, Element } from "@stencil/core";
import { API_KEY } from "../../global/global";

@Component({
  tag: 'us-stock-price',
  styleUrl: './us-stock-price.css',
  shadow: true
})

export class UsStockPrice {

  @Element() el: HTMLElement;
  @State() fetchedPrices: number;
  @State() value: string;
  stockInput: HTMLInputElement;

  private onfetchDataFromStocks = (event: Event): void => {

    event.preventDefault();

    // const stockSymbol:string = (this.el.shadowRoot.querySelector('#stocks-input') as HTMLElement).nodeValue;
    const stockSymbol = this.stockInput.value;

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(responseParsed => {
        console.log(responseParsed['Global Quote']['05. price']);
        this.fetchedPrices = +responseParsed['Global Quote']['05. price']
      })
      .catch(error => console.log(error));
  };

  handleChange(event) {
    this.value = event.target.value;
    console.log(this.value);
  }


  render() {
    return [
      <form onSubmit={this.onfetchDataFromStocks.bind(this)}>
        <input type="text" id="stocks-input" ref={el => this.stockInput = el}/>
        <button>Fetch</button>
      </form>,
      <div>
        <p>Price: ${this.fetchedPrices}</p>
      </div>
    ]
  }
}
