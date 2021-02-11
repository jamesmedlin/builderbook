import React, { useEffect } from 'react';
import withAuth from '../../lib/withAuth';

import { BigTitle, LittleTitle } from '../../common/textElements';
import { Container } from '../../components/Container';

function Dashboard() {
  return (
    <>
      <div className="topRow">
        <div>Views: ___</div>
        <div>Customer Targeting:</div>
        <div>Age Range: ___</div>
        <div>Gender: ___</div>
        <div>Geographic Spread: ___</div>
        <div>Shortcut Buttons: ___, ___, ____.</div>
      </div>
      <style jsx>
        {`
          .topRow {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 300px;
            padding-bottom: 15px;
            background-color: white;
          }
          @media (max-width: 768px) {
            .topRow {
              padding-top: 200px;
              padding-bottom: 15px;
            }
          }
        `}
      </style>
    </>
  );
}

export default withAuth(Dashboard);
