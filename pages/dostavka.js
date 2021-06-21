import React from 'react';
import {Container, Typography, Grid} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import Head from 'next/head';

export function Payment () {
    return (
        <>
        <Head></Head>
            <title>Условия за плащане | Vitalize.bg</title>
            <Container style={{padding:'2rem'}}>
                <Typography variant='h1'>Условия за плащане</Typography>
                <Typography variant='body2'>Условията за плащане са основно наложен платеж. Към момента не приемаме друг вид плащане.</Typography>
                <Grid container>
                <Grid item xs={12} md={6}>
                    <Typography>Some text</Typography>
                </Grid>
                <Grid item xs={12} md={6}>

                </Grid>
            </Grid>
            </Container>
        </>
    )
}

export default Payment