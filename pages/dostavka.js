import React from 'react';
import {Container, Typography} from '@material-ui/core';
import Head from 'next/head';

export function Payment () {
    return (
        <>
        <Head></Head>
            <title>Условия за плащане | Vitalize.bg</title>
            <Container style={{padding:'2rem'}}>
                <Typography variant='h1'>Условия за плащане</Typography>
                <Typography variant='body2'>Условията за плащане са основно наложен платеж.</Typography>
            </Container>
        </>
    )
}

export default Payment