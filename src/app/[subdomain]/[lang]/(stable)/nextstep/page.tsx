const data = {
  primaryText: 'Increase your sales',
  primaryImage: 'http://localhost:5173/src/assets/sales_Card.svg',
  mainText: 'How to boost your sales?',
  subText: [
    'Optimize your social media handles with comprehensive details about your services and customer testimonials.',
    'Set up a WhatsApp auto-response with a courteous greeting and a link to your online booking or catalog.',
    'Create a loyalty program that provides not only discounts but also early access to new products or premium services.',
    'Send a personalized follow-up email 24-48 hours after service, requesting feedback and offering easy links to review sites.',
    'Train staff to emphasize the importance of reviews during check-out, explaining how they help improve services.',
    'Develop a customer feedback program that gathers reviews and actively involves customers in product development or service enhancements.',
    'Create short, informative video content for platforms like YouTube or Instagram, showcasing product uses or answering common questions.',
    'Add QR codes to packaging and receipts, offering a discount on their next visit when they order through the app.',
    'Implement a referral program that rewards both the referrer and the new customer with meaningful discounts or perks.',
    'Add your store link to your LinkedIn and Instagram company pages, targeting professional connections.',
    'Produce how-to videos that demonstrate the use and benefits of your app or products.',
    'Offer personalized recommendations or curated lists based on user preferences to improve the shopping experience.',
    'Provide a free trial or sample of your product or service to attract new users.',
    'Create a tiered pricing strategy or bundle offers that encourage larger purchases or subscriptions.',
    'Participate in trade shows or conferences to show your products or services and generate high-quality leads.'
  ]
}

import { Grid, List, ListItem, Typography } from '@mui/material'

export default function NextStep() {
  return (
    <>
      <Grid lg={12} xs={12} md={12} sm={12}>
        <Typography variant='h3'>{data.mainText}</Typography>
        {data.subText && (
          <List sx={{ listStyleType: 'disc', paddingLeft: 2 }}>
            {data.subText.map((text, index) => (
              <ListItem key={index} sx={{ display: 'list-item', paddingLeft: 2 }}>
                <Typography variant='body1'>{text}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Grid>
    </>
  )
}
