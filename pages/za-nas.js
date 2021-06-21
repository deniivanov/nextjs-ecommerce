import React from 'react';
import {Container, Button, Typography, Grid} from '@material-ui/core';
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
        <Grid container>
            <Grid item xs={12} md={12}>
                <Typography variant='h3'>
                    Как започнахме
                </Typography>
                 <Typography variant='body2'>
                     След като дълго време търсихме качествен, леснодостъпен и същевременно достъпен ценово уебсайт, с изпитани и качествени продукти и не открихме такъв, решихме, че е време сами да го създадем. С дългогодишен опит в продажбите на продукти подобряващи здравето на хората нашият екип стартира бранда Vitalize с цел да предостави възможността на повече хора в България да имат достъп до невероятните продукти, които предлагаме.
                 </Typography>
            </Grid>
            <Grid style={{paddingTop:'2rem'}}item xs={12} md={12}>
                <Typography variant='h3'>Нашата мисия</Typography>
                <Typography variant='body2'>Нашата мисия винаги е била една-единствена. Да успеем да облекчим болките на възможно повече хора, като в същото време го правим чрез натурални продукти на достъпни цени. Продуктите предлагани от виталайз не са магически, но с годините сме се уверили, че повечето от продуктите, които предлагаме са супер ефективни, а в комбинация със знанията на нашите консултанти, болежките се превръщат в част от миналото. </Typography>
            </Grid>
            <Grid style={{paddingTop:'2rem'}} item xs={12} md={12}>
                <Typography variant='h3'>Дългосрочна визия</Typography>
                <Typography variant='body2'>Нашата цел е да успеем да наложим Виталайз като един от водещите брандове натурални продукти с цел подобряване на качеството на живот на хората. Произведени в Германия по най-висок стандарт, предлаганите от нас продукти са безкомпромисни и невероятните резултати, които ще усетите от тях са гарантирани.</Typography>
            </Grid>
        </Grid>
        </Container>
        </div>
    </Container>
        </>
    )
}

export default AboutUs