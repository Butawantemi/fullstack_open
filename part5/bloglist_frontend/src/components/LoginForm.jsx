const LoginForm = ({
  handleSubmit,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <div>
      <h2>Log in to the application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Username:{' '}
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Password:{' '}
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
