import Lucide from "../../base-components/Lucide";
import StatisticsCard from "../../components/Dashboard/statistics-card"
import { icons } from "../../base-components/Lucide";

export interface Card {
  title: string;
  icon: keyof typeof icons;
  items?: any;
}

function Statistics(props: Card) {
  return (
    <div className="col-span-12 md:col-span-6 p-2 box">
      <div className="p-1 flex text-base font-medium truncate my-1 item-center">
        <Lucide icon={props.icon} className="w-5 h-5 me-1" />
        {props.title}
      </div>
      <div className="grid grid-cols-12 gap-2">
        {props.items?.map((item:any, i: number) => {
          return (
            <StatisticsCard key={i} icon={item.icon} title={item.title} number={item.number} />
          );
        })}
      </div>
    </div>
  );
}

export default Statistics;