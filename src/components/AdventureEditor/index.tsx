import { useState, type FC } from "react";

import type { IAdventure } from "../../stores/adventureStore";
import { AdventureSettings } from "./AdventureSettings";
import { Challenges } from "./Challenges";
import * as S from "./styles";

const tabs = ["General adventure settings", "Hardware mapping", "Challenges"];

interface IProps {
  adventure: IAdventure | undefined;
}

export const AdventureEditor: FC<IProps> = ({ adventure }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <S.Wrapper>
      <S.EditorTabs>
        {tabs.map((tab, index) => (
          <S.Tab
            key={tab + index}
            active={selectedTab === index}
            onClick={() => setSelectedTab(index)}
          >
            {tab}
          </S.Tab>
        ))}
      </S.EditorTabs>
      {selectedTab === 0 && <AdventureSettings adventure={adventure} />}
      {selectedTab === 1 && <div>Hardware mapping</div>}
      {selectedTab === 2 && <Challenges />}
    </S.Wrapper>
  );
};
