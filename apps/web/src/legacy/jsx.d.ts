import "react";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      /** The legacy home page still uses the deprecated <marquee> for its notice bar. */
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { behavior?: string; direction?: string; scrollamount?: string | number },
        HTMLElement
      >;
    }
  }
}
