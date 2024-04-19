import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import Logo from '../assets/icons/logo.svg';

const LogoHeader = () => {
  return (
    <Layout
      style={{
        paddingTop: 20,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      level="3">
      <Logo width={80} height={80} />
      <Text category="h4" style={{marginLeft: 50}}>
        Pengucards
      </Text>
    </Layout>
  );
};

export default LogoHeader;
