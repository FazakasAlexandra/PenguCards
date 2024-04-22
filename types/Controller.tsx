export type ControllerProps = {
  title: string;
  counter: number;
  controlls: string;
  filterCards: (searchTerm: string) => void;
  resetFilter: () => void;
};
