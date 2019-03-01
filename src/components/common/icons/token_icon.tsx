import React from 'react';
import styled from 'styled-components';

import { ReactComponent as AeTokenIcon } from '../../../assets/icons/ae.svg';
import { ReactComponent as AgiTokenIcon } from '../../../assets/icons/agi.svg';
import { ReactComponent as AntTokenIcon } from '../../../assets/icons/ant.svg';
import { ReactComponent as AstTokenIcon } from '../../../assets/icons/ast.svg';
import { ReactComponent as BatTokenIcon } from '../../../assets/icons/bat.svg';
import { ReactComponent as CvcTokenIcon } from '../../../assets/icons/cvc.svg';
import { ReactComponent as DaiTokenIcon } from '../../../assets/icons/dai.svg';
import { ReactComponent as DgdTokenIcon } from '../../../assets/icons/dgd.svg';
import { ReactComponent as DgxTokenIcon } from '../../../assets/icons/dgx.svg';
import { ReactComponent as DntTokenIcon } from '../../../assets/icons/dnt.svg';
import { ReactComponent as FunTokenIcon } from '../../../assets/icons/fun.svg';
import { ReactComponent as GnoTokenIcon } from '../../../assets/icons/gno.svg';
import { ReactComponent as LinkTokenIcon } from '../../../assets/icons/link.svg';
import { ReactComponent as LptTokenIcon } from '../../../assets/icons/lpt.svg';
import { ReactComponent as ManaTokenIcon } from '../../../assets/icons/mana.svg';
import { ReactComponent as MkrTokenIcon } from '../../../assets/icons/mkr.svg';
import { ReactComponent as MlnTokenIcon } from '../../../assets/icons/mln.svg';
import { ReactComponent as OmgTokenIcon } from '../../../assets/icons/omg.svg';
import { ReactComponent as PowrTokenIcon } from '../../../assets/icons/powr.svg';
import { ReactComponent as RenTokenIcon } from '../../../assets/icons/ren.svg';
import { ReactComponent as RepTokenIcon } from '../../../assets/icons/rep.svg';
import { ReactComponent as ReqTokenIcon } from '../../../assets/icons/req.svg';
import { ReactComponent as SaltTokenIcon } from '../../../assets/icons/salt.svg';
import { ReactComponent as SntTokenIcon } from '../../../assets/icons/snt.svg';
import { ReactComponent as SpankTokenIcon } from '../../../assets/icons/spank.svg';
import { ReactComponent as WaxTokenIcon } from '../../../assets/icons/wax.svg';
import { ReactComponent as ZilTokenIcon } from '../../../assets/icons/zil.svg';
import { ReactComponent as ZrxTokenIcon } from '../../../assets/icons/zrx.svg';
import { DEFAULT_FALLBACK_ICON_COLOR } from '../../../common/constants';
import { Token } from '../../../util/types';

interface Props {
    token: Token;
}

const TokenIcons = {
    AeTokenIcon,
    AgiTokenIcon,
    AntTokenIcon,
    AstTokenIcon,
    BatTokenIcon,
    CvcTokenIcon,
    DaiTokenIcon,
    DgdTokenIcon,
    DgxTokenIcon,
    DntTokenIcon,
    FunTokenIcon,
    GnoTokenIcon,
    LinkTokenIcon,
    LptTokenIcon,
    ManaTokenIcon,
    MkrTokenIcon,
    MlnTokenIcon,
    OmgTokenIcon,
    PowrTokenIcon,
    RenTokenIcon,
    RepTokenIcon,
    ReqTokenIcon,
    SaltTokenIcon,
    SntTokenIcon,
    SpankTokenIcon,
    WaxTokenIcon,
    ZilTokenIcon,
    ZrxTokenIcon,
};

const IconContainer = styled.div<{ color: string }>`
    align-items: center;
    background-color: ${props => (props.color ? props.color : 'transparent')};
    border-radius: 50%;
    display: flex;
    height: 1.6em;
    justify-content: center;
    width: 1.6em;
`;

const Label = styled.label`
    color: #ffffff;
    font-size: 0.7em;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

export const TokenIcon = (props: Props) => {
    const { token } = props;
    const TokenIconComponentName = getTokenIconNameBySymbol(token.symbol) as keyof typeof TokenIcons;
    const Icon: React.FunctionComponent = TokenIcons[TokenIconComponentName];
    return (
        <IconContainer color={token.primaryColor || DEFAULT_FALLBACK_ICON_COLOR}>
            {Icon ? <Icon /> : <Label>{token.symbol && token.symbol.toUpperCase()}</Label>}
        </IconContainer>
    );
};

const getTokenIconNameBySymbol = (symbol: string): string => {
    return `${symbol.charAt(0).toUpperCase()}${symbol.slice(1)}TokenIcon`;
};
