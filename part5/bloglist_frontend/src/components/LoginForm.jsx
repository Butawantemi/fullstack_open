import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <div>
      <Typography variant='h4' sx={{ marginTop: 5 }}>Log in to the application</Typography>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <TextField
            data-testid="username"
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            id="standard-basic" label="Username" variant="standard"
            inputProps={{ 'data-testid': 'username' }}
          />
        </div>
        <div>
          <TextField
            data-testid="password"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            id="standard-basic" label="Password" variant="standard"
            inputProps={{ 'data-testid': 'password' }}
          />
        </div>
        <Button variant="contained" style={{ marginTop: 10 }} type="submit">login</Button>
      </Box>
    </div>
  )
}

export default LoginForm
