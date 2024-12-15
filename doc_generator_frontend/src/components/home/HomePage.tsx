// components/home/HomePage.tsx
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button,
    Container 
  } from '@mui/material';
  import { Description, Code, AccountTree, AutoAwesome } from '@mui/icons-material';
  
  const features = [
    {
      title: 'Documentation Generator',
      description: 'Create professional documentation with AI-powered templates and suggestions.',
      icon: <Description fontSize="large" color="primary" />,
      path: '/documentation'
    },
    {
      title: 'Code Analysis',
      description: 'Analyze and document your code with intelligent insights and recommendations.',
      icon: <Code fontSize="large" color="primary" />,
      path: '/code-analysis'
    },
    {
      title: 'Workflow Diagrams',
      description: 'Generate clear and interactive workflow diagrams from your descriptions.',
      icon: <AccountTree fontSize="large" color="primary" />,
      path: '/workflows'
    },
    {
      title: 'AI Assistant',
      description: 'Get intelligent suggestions and improvements for your documentation.',
      icon: <AutoAwesome fontSize="large" color="primary" />,
      path: '/assistant'
    }
  ];
  
  const HomePage = () => {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 12 }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            AI-Powered Documentation Generator
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Create professional documentation, analyze code, and generate workflow diagrams
            with the power of artificial intelligence.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" size="large">
              Get Started
            </Button>
            <Button variant="outlined" size="large">
              Learn More
            </Button>
          </Box>
        </Box>
  
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {feature.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto', justifyContent: 'center' }}>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };
  
  export default HomePage;