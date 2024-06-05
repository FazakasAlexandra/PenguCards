export type ControllerProps = {
  title: string;
  counter: number;
  controls: string;
  filterCards: (searchTerm: string) => void;
  resetFilter: () => void;
};
