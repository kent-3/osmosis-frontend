import Image from "next/image";
import { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { TokenSelect } from "../../../control";
import { InputBox } from "../../../input";
import { StepProps } from "./types";
import { StepBase } from "./step-base";
import { useWindowSize } from "../../../../hooks";
import { BorderButton } from "../../../buttons";
import { useTranslation } from "react-multi-lang";

export const Step1SetRatios: FunctionComponent<StepProps> = observer(
  (props) => {
    const { createPoolConfig: config } = props;
    const { isMobile } = useWindowSize();
    const t = useTranslation();

    return (
      <StepBase step={1} {...props}>
        <div className="flex flex-col gap-2.5">
          {config.assets.map(({ amountConfig, percentage }, index) => (
            <div
              key={amountConfig.sendCurrency.coinDenom}
              className="flex items-center shrink-0 place-content-between h-24 md:h-auto px-7 md:p-2.5 border border-osmoverse-700 rounded-2xl"
            >
              <TokenSelect
                selectedTokenDenom={amountConfig.sendCurrency.coinDenom}
                tokens={config.remainingSelectableCurrencies.concat(
                  amountConfig.sendCurrency
                )}
                onSelect={(coinDenom) => {
                  const currency = config.remainingSelectableCurrencies.find(
                    (currency) => currency.coinDenom === coinDenom
                  );
                  if (currency) {
                    amountConfig.setSendCurrency(currency);
                  } else {
                    console.error(
                      "Unable to find currency selected in TokenSelect to be set in create pool config"
                    );
                  }
                }}
              />
              <div className="flex items-center md:gap-1 gap-2.5 text-h6 font-h6 md:subtitle1">
                <BorderButton
                  className={classNames("!h-full md:p-1 md:py-0", {
                    hidden: config.assets.length < 2,
                  })}
                  onClick={() => config.setBalancedPercentages()}
                >
                  {config.balancedPercentage.maxDecimals(0).toString()}
                </BorderButton>
                <InputBox
                  type="number"
                  inputClassName="text-h5 font-h5 md:subtitle1 w-32 md:w-14"
                  currentValue={percentage}
                  onInput={(value) => config.setAssetPercentageAt(index, value)}
                  placeholder=""
                  trailingSymbol="%"
                  rightEntry
                />
              </div>
            </div>
          ))}
          <button
            className={classNames(
              "flex items-center shrink-0 gap-5 md:p-2.5 px-6 py-4 border border-osmoverse-700 rounded-2xl select-none",
              config.canAddAsset
                ? "hover:border-wosmongton-200 cursor-pointer"
                : "opacity-30 cursor-default"
            )}
            onClick={() => {
              const unusedAsset = config.remainingSelectableCurrencies.find(
                () => true
              );
              if (unusedAsset) {
                config.addAsset(unusedAsset);
              }
            }}
          >
            <div className="flex items-center justify-center bg-wosmongton-500 h-7 w-7 md:h-6 md:w-6 ml-1.5 rounded-full">
              <Image
                alt="add"
                src="/icons/add.svg"
                height={isMobile ? 12 : 15}
                width={isMobile ? 12 : 15}
              />
            </div>
            <span className="subtitle1">
              {t("pools.createPool.buttonAddToken")}
            </span>
          </button>
        </div>
      </StepBase>
    );
  }
);
