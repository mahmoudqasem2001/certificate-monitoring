import { CertificateTable, Container, DomainInput, Footer } from "../components";

const HomePage: React.FC = () => {
return (
<Container>
<h2 className="text-2xl font-bold text-center pb-12 pt-6">Certificate Search</h2>
<DomainInput/>
<CertificateTable/>
<Footer/>
</Container>
);
}


export default HomePage