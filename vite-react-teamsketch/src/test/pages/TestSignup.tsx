import Grid from '../../components/common/grid/Grid';
import GridItem from '../../components/common/grid/GridItem';
import Container from '../components/layout/Container';
import BackButton from '../../components/common/button/BackButton';

const Signup = () => {
  return (
    <Container>
        <BackButton />
        <Grid>
            <GridItem>
                <h1>Signup</h1>
            </GridItem>
        </Grid>
    </Container>
  );
};

export default Signup;
