declare module "gsap/SplitText" {
  export class SplitText {
    constructor(
      targets:
        | string
        | string[]
        | Element
        | Element[]
        | NodeList
        | HTMLElement
        | HTMLElement[],
      vars?: any
    );
    public chars: HTMLElement[];
    public words: HTMLElement[];
    public lines: HTMLElement[];
    public revert(): void;
  }
}

declare module "gsap/ScrollSmoother" {
  export class ScrollSmoother {
    constructor(vars?: any);
    static create(vars?: any): ScrollSmoother;
    static refresh(force?: boolean): void;
    public scrollTop(value: number, duration?: number): void;
    public scrollTo(target: string | Element | number, prevent?: boolean, align?: string): void;
    public paused(value?: boolean): void;
  }
}
