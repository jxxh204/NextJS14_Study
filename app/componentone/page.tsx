type Props = {
  state: string | null;
};
function ComponentOne({ state }: Props) {
  return <>ComponentOne{state}</>;
}

export default ComponentOne;
