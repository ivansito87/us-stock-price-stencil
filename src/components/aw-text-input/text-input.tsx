import { Component, Prop, h } from "@stencil/core";
import { JSXElement } from "@babel/types";


@Component({
  tag: "aw-text-input",
  styleUrl: './aw-text-input.css',
  shadow: true
})
export class AwTextInput {
  @Prop() name?: string;

  textInput!: HTMLInputElement;

  handleSubmit = (ev: Event) => {
    ev.preventDefault();
    console.log(this.textInput.value);
  };

  public adds(num1: number, num2: number): number {
    let result = num1 + num2;
    console.log(result);
    return result;
  }

  render(): JSXElement {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              ref={el => (this.textInput = el as HTMLInputElement)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h1>{this.adds(2, 3)}</h1>
      </div>
    );
  }
}

