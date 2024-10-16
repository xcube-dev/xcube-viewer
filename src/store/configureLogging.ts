import diff, { type Difference } from "microdiff";
import { StoreState } from "@/store/store";
import { store } from "@/store/appStore";

const indexStyle = "color:light-dark(lightblue, lightblue)";
const typeStyle = "font-weight:bold";
const pathStyle = "color:light-dark(darkgrey, lightgray)";

let unsubscribe: (() => void) | undefined = undefined;

export function configureLogging(options?: { enabled?: boolean }) {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = undefined;
  }
  if (!options || options.enabled) {
    unsubscribe = store.subscribe(logState);
  }
}

function logState(next: StoreState, prev: StoreState) {
  const delta = diff(prev, next);
  const nDiffs = delta.length;
  console.groupCollapsed(
    `state changed (${nDiffs} difference${nDiffs === 1 ? "" : "s"})`,
  );
  delta.forEach(logDiff);
  console.debug("Details:", { prev, next, delta });
  console.groupEnd();
}

function logDiff(v: Difference, index: number) {
  const wherePart = `%c${index + 1} %c${v.type} %c${v.path.join(".")}`;
  if (v.type === "CREATE") {
    console.log(wherePart, indexStyle, typeStyle, pathStyle, {
      value: v.value,
    });
  } else if (v.type === "CHANGE") {
    console.log(wherePart, indexStyle, typeStyle, pathStyle, {
      value: v.value,
      oldValue: v.oldValue,
    });
  } else if (v.type === "REMOVE") {
    console.log(wherePart, indexStyle, typeStyle, pathStyle, {
      oldValue: v.oldValue,
    });
  }
}
