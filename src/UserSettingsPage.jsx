// import { useState } from "react";
import { Link } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

export default function Settings() {
  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <CardContent>
            <Button component={Link} to="/settings/changePassword">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
