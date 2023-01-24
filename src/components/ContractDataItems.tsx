import { ethers } from "ethers";
import { useMemo } from "react";
import { PrettyAddress } from "./PrettyAddress";
import { DefinitionListItem } from "./DefinitionListItem";
import { FragmentsOnCompositeTypesRule } from "graphql";
import { formatEther } from "ethers/lib/utils.js";

type ContractDataItemsProps = {
  args: ethers.utils.Result;
  functionFragmentInputs: ethers.utils.ParamType[];
};

function formatPretty(input: string): string {
  return input
    .replace(/([A-Z])(?=[a-z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
}

function hasPart(searches: string[], value: string): boolean {
  return !!searches.find(
    (search) => value.toLowerCase().indexOf(search) !== -1
  );
}

export const ContractDataItems = ({
  args,
  functionFragmentInputs,
}: ContractDataItemsProps) => {
  const dataItems = useMemo(() => {
    const results = [];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const fragment = functionFragmentInputs[i];

      let valueStr: any = arg.toString();
      if (fragment.type === "address") {
        results.push(
          <DefinitionListItem
            name={formatPretty(fragment.name)}
            title={fragment.name}
          >
            <PrettyAddress address={arg.toString()} />
          </DefinitionListItem>
        );
      } else if (fragment.type === 'string') {
        results.push(
          <DefinitionListItem name={formatPretty(fragment.name)} title={fragment.name}>
            <span className="text-gray-400">"</span>
            <span>{arg}</span>
            <span className="text-gray-400">"</span>
          </DefinitionListItem>
        )
      } else if (hasPart(["price", "amount", "eth"], fragment.name)) {
        results.push(
          <DefinitionListItem
            name={formatPretty(fragment.name)}
            title={fragment.name}
          >
            <span title={arg.toString()}>{formatEther(arg)} ETH</span>
          </DefinitionListItem>
        );
      } else if (fragment.type === "tuple") {
        results.push(
          <DefinitionListItem
            title={fragment.name}
            name={formatPretty(fragment.name)}
          >
            <div className={"ml-8 mt-2"}>
              <ContractDataItems
                args={arg}
                functionFragmentInputs={fragment.components}
              />
            </div>
          </DefinitionListItem>
        );
      } else {
        results.push(
          <DefinitionListItem
            name={formatPretty(fragment.name)}
            title={fragment.name}
          >
            {arg.toString()}
          </DefinitionListItem>
        );
      }
    }
    return results;
  }, [args, functionFragmentInputs]);
  return <dl>{dataItems}</dl>;
};
