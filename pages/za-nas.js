import React from 'react';
import {Container, Button, Typography} from '@material-ui/core';
import Head from 'next/head';

export function AboutUs () {
    return (
        <>
        <Head>
            <title>За нас | Vitalize.bg</title>
        </Head>
    <Container style={{padding:'2rem', backgroundColor:'#fff', color:'#000'}}>
        <div align='center'>
            <Typography variant='h1'>За Vitalize.bg</Typography>
        <Container style={{padding:'4rem'}}>
            <Typography variant='body2'>Виталайз е мястото, където изпитаните природни продукти срещат достъпните цени и където можете да очаквате само и единствено качествени продукти, с доказана ефикасност.</Typography>
            <Typography variant='body2'>Нашата цел винаги е била да бъдем най-добрия търговец на натурални продукти в България и през годините хиляди българи се довериха на опита ни с надеждата да подобрят своето здраве.</Typography>
        <Typography variant='h4'>Нашата история</Typography>
            <Typography variant='body2'>Създаден през 2020 година, уебсайта Vitalize.bg е сравнително нов, но продуктите, които ние предлагаме са с дългогодишна история и освен това нашите търговци имат общо над 10 години опит в бранша.</Typography>
        </Container>
        </div>
    </Container>
        </>
    )
}

export default AboutUs