import styled from 'styled-components'

const ComingSoonHeader = styled.h1`
    font-weight: 700;
    margin: 0;
    border-bottom: 4px solid black;
`

const HomePageBg = styled.div`
    background-color: #5c5c5c;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
const HomePage = () => {
    return (
        <HomePageBg>
            <ComingSoonHeader>Coming soon!</ComingSoonHeader>
        </HomePageBg>
    )
}

export default HomePage
