/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import withAuth from '../../../lib/withAuth';

import { getMyAdvertisementsApiMethod } from '../../../lib/api/customer';
import { BigTitle, LittleTitle } from '../../../common/textElements';
import CreateAdvertisement from './create-advertisement';

function Dashboard({ advertisements }) {
  const [createAd, setCreateAd] = useState(false);

  return (
    <>
      <div className="topRow">
        <div className="title">Your Advertisements</div>
        <div key="create" className="createContainer">
          <Link
            href="/customer/dashboard/create-advertisement"
            as="/dashboard/create-advertisement"
          >
            <Button variant="contained">Create</Button>
          </Link>
        </div>
        {!createAd && (
          <div>
            {advertisements.length !== 0 ? (
              advertisements.map((ad) => (
                <div key={ad.name} className="advertisementContainer">
                  <div className="adItem">Name: {ad.name}</div>
                  <div className="adItem">Views: {ad.viewers}</div>
                  <div className="adItem">Uri: {ad.uri}</div>
                  <div className="adItem">Website: {ad.website}</div>
                  <div className="adItem">
                    Geographic Spread: {ad.longitude}, {ad.latitude}: {ad.radius} miles.
                  </div>
                  <div className="adItem">Age Range: ___</div>
                  <div className="adItem">Gender: ___</div>
                  <div className="adItem">Shortcut Buttons: ___, ___, ____.</div>
                  <Link
                    href={`/admin/edit-advertisement?slug=${ad.slug}`}
                    as={`/dashboard/edit-advertisement/${ad.slug}`}
                  >
                    <Button variant="contained">Edit</Button>
                  </Link>
                </div>
              ))
            ) : (
              <div>
                <div>You currently have no Advertisements</div>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx>
        {`
          .topRow {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding-top: 200px;
            padding-bottom: 15px;
            margin-left: 15%;
            margin-right: 15%;
            padding-bottom: 50px;
          }
          @media (max-width: 768px) {
            .topRow {
              padding-top: 200px;
              padding-bottom: 15px;
            }
          }
          .createContainer {
            align-self: flex-end;
          }
          .title {
            align-self: center;
            font-size: 36px;
            margin-bottom: 40px;
          }
          .advertisementContainer {
            margin-bottom: 45px;
            justify-content: space-around;
          }
          .adItem {
            margin-top: 5px;
            margin-bottom: 5px;
          }
        `}
      </style>
    </>
  );
}

Dashboard.getInitialProps = async ({ req, res }) => {
  if (req && !req.user) {
    res.redirect('/login');
    return { advertisements: [] };
  }

  const headers = {};
  if (req && req.headers && req.headers.cookie) {
    headers.cookie = req.headers.cookie;
  }

  const { advertisements } = await getMyAdvertisementsApiMethod({ headers });
  return { advertisements };
};

export default withAuth(Dashboard);
