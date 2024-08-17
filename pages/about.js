import Head from 'next/head';
import Sidebar from '../components/Sidebar';

const AboutPage = () => {
    return (
        <div>
            <Head>
                <title>Acerca de</title>
                <meta name="description" content="Página acerca de mi juego web" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Sidebar />
            <main>
                <h1>Acerca de</h1>
                <p>hecho por Korsinemi y eso xD</p>
            </main>
        </div>
    );
};

export default AboutPage;
