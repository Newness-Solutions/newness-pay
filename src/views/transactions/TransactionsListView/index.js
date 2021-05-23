import React from 'react';
import Page from 'src/components/Page';
import NoResults from 'src/components/NoResults';
import { Container } from '@material-ui/core';

const TransactionsListView = () => {
  return (
    <Page title="Balances">
      <Container maxWidth={false}>
        <NoResults title="Tansactions" />
      </Container>
    </Page>
  );
};

export default TransactionsListView;
