import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import clsx from "clsx";
import { icons } from "../../base-components/Lucide";

export interface Card {
  icon: keyof typeof icons;
  title: string;
  number?: string|number;
}

function StatisticsCard(props: Card) {
  return (
    <div
      className={clsx([
        "relative col-span-6 p-2 box border-dark/30 dark:border-white/10",
      ])}
    >
      <div data-content>
        <div className="mt-2 leading-7">
          <div className="flex w-fit m-auto items-center justify-center text-primary border rounded-full p-1 border-primary/50 dark:border-white/70">
            <Lucide
              className="w-8 h-8 dark:text-white/70"
              icon={props.icon}
            />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <div className="font-medium text-base leading-7 capitalize">{props.title}</div>
          <div className="ml-auto">
            <Tippy
              as="div"
              className="flex items-center text-xl font-medium pl-2 cursor-pointer text-success"
              content={`${props.number} active ${props.title.toLowerCase()}`}
            >
              {props.number}
            </Tippy>
          </div>
        </div>
      </div>
    </div>
  );

}
export default StatisticsCard;