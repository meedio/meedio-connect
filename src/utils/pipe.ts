/* eslint-disable @typescript-eslint/ban-types */
// info: https://medium.com/free-code-camp/pipe-and-compose-in-javascript-5b04004ac937
// code src: https://blog.logrocket.com/how-to-create-compose-function-typescript/

const pipe =
  (...fns: Function[]) =>
  (arg: unknown) =>
    fns.reduce((prevValue, fn) => fn(prevValue), arg);

export default pipe;

/*
** Example using pipe
  const roomsToSet = pipe(
    filterArchivedChats(mxUserId),
    sortChats
  )(matrixClient.current?.getRooms());
  setRooms(roomsToSet);

** Example without pipe
  const rooms = matrixClient.current?.getRooms()
  const filteredRooms = filterArchivedChats(mxUserId)(rooms)
  const sortedRooms = sortChats(filteredRooms)
  setRooms(sortedRooms)
*/
