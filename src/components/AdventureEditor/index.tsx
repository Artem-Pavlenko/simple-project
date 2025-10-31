import { type FC } from "react";
import { useSearchParams } from "react-router-dom";

import type { AdventureType } from "../../utils/types/adventure.types";
import { HardwareMapping } from "..";
import { AdventureSettings } from "./AdventureSettings";
import { Challenges } from "./Challenges";
import * as S from "./styles";

const tabs = ["General adventure settings", "Hardware mapping", "Challenges"];

interface IProps {
  adventure: AdventureType | undefined;
}

export const AdventureEditor: FC<IProps> = ({ adventure }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const selectedTab = tabParam ? parseInt(tabParam, 10) : 0;

  const handleTabChange = (index: number) => {
    setSearchParams({ tab: index.toString() });
  };

  return (
    <S.Wrapper>
      <S.EditorTabs>
        {tabs.map((tab, index) => (
          <S.Tab
            key={tab + index}
            $active={selectedTab === index}
            onClick={() => handleTabChange(index)}
          >
            {tab}
          </S.Tab>
        ))}
      </S.EditorTabs>
      {selectedTab === 0 && <AdventureSettings adventure={adventure} />}
      {selectedTab === 1 && <HardwareMapping />}
      {selectedTab === 2 && <Challenges adventure={adventure} />}
    </S.Wrapper>
  );
};
