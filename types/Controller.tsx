export type ControllerProps = {
  title: string;
  counter: number;
  controlls: string;
  sendSearchTerm: (searchTerm: string) => void;
};
