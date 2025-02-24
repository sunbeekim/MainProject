import Grid from '../../components/common/Grid';
import GridItem from '../../components/common/GridItem';
import Container from '../components/layout/Container';
import BackButton from '../../components/forms/button/BackButton';

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
