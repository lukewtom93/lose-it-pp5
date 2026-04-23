import { Button, Card, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../App.module.css";

function ProfilePage() {
  const currentUser = useCurrentUser();
  const history = useHistory();

  if (!currentUser) {
    return <p>Loading...</p>;
  }


  return (
    <Container className="mt-4">
      <Card className={`p-4 text-center ${styles.card}`}>

        <h2>
          {currentUser.username}
        </h2>

        <div className="mt-3">

          <Button
            variant="outline-primary"
            className="mr-3"
            onClick={() =>
              history.push(
                `/profiles/${currentUser.profile_id}/edit`
              )
            }
          >
            Edit Profile
          </Button>

        </div>

      </Card>
    </Container>
  );
}

export default ProfilePage;