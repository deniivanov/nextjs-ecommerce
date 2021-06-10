import React from 'react';
import {Container, Typography, Button} from '@material-ui/core';
import Head from 'next/head';


export function Deliveries() {
    return (
        <>
            <Head>
                <title>Условия за доставка | Vitalize.bg</title>
            </Head>
        <Container style={{padding:'2rem'}}>
            <Typography variant='h1'>Условия за доставка</Typography>
            <Typography variant='body2'>Нашите условия за доставка са следните</Typography>
        </Container>
            </>
            )
}

export default Deliveries