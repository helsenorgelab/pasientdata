import moment from "moment";

export default function findStartAndEndIndex(data, length, start, end) {
  let startIndex = 0;
  let endIndex = length - 1;
  let endIndexFound = false;

  if (
    moment(end, "YYYY-MM-DDTHH:mm:ss").isAfter(
      moment(data[length - 1].start, "YYYY-MM-DDTHH:mm:ss")
    )
  ) {
    endIndexFound = true;
  }

  for (let i = 0; i < length; i++) {
    if (
      moment(start, "YYYY-MM-DDTHH:mm:ss").isAfter(
        moment(data[i].start, "YYYY-MM-DDTHH:mm:ss")
      )
    ) {
      startIndex = i; // Index right before the first data point we want to include.
    }
    if (
      !endIndexFound &&
      moment(end, "YYYY-MM-DDTHH:mm:ss").isBefore(
        moment(data[i].start, "YYYY-MM-DDTHH:mm:ss")
      )
    ) {
      endIndex = i; // Index right after the first data point we want to include.
      break;
    }
  }
  if (!endIndexFound) {
    endIndex--;
  }
  if (startIndex !== length - 1) {
    startIndex++;
  }

  return { startIndex: startIndex, endIndex: endIndex };
}
