// 'use client'

// import { Box, Card, CardMedia, List, ListItem, Modal, Typography } from '@mui/material'
// import { green } from '@mui/material/colors'
// import { useState } from 'react'

// interface CustomPopUpCardProps {
//   primaryText: string
//   mainText: string
//   imageSrc: string
//   subText?: string[]
// }

// const getRandomColor = () => {
//   const letters = '0123456789ABCDEF'
//   let color = '#'
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)]
//   }
//   return color
// }

// const InfoPopUp = ({ primaryText, mainText, imageSrc, subText }: CustomPopUpCardProps) => {
//   const [open, setOpen] = useState(false)

//   const handleOpen = () => setOpen(true)
//   const handleClose = () => setOpen(false)

//   return (
//     <>
//       <div>
//         <Card
//           sx={{
//             display: 'flex',
//             width: '240px',
//             height: '120px',
//             cursor: 'pointer',
//             padding: 2,
//             gap: 2,
//             backgroundColor: green[300],
//             borderRadius: '12px'
//           }}
//           onClick={handleOpen}
//         >
//           <Box sx={{ width: { xs: '50%', sm: '40%' }, textAlign: 'left' }}>
//             <Typography gutterBottom variant='h6' component='div' sx={{ color: 'white', fontWeight: 'bold' }}>
//               {primaryText}
//             </Typography>
//           </Box>
//           <CardMedia
//             component='img'
//             sx={{
//               objectFit: 'contain'
//             }}
//             image={imageSrc}
//           />
//         </Card>
//         <Modal open={open} onClose={handleClose}>
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: '70%',
//               height: '50%',
//               bgcolor: 'background.paper',
//               boxShadow: 24,
//               p: 4,
//               borderRadius: 2,
//               overflowY: 'auto'
//             }}
//           >
//             <div className='text-center'>
//               <Typography gutterBottom variant='h5' component='div'>
//                 {mainText}
//               </Typography>
//             </div>

//             {subText && (
//               <List sx={{ listStyleType: 'disc', paddingLeft: 2 }}>
//                 {subText.map((text, index) => (
//                   <ListItem key={index} sx={{ display: 'list-item', paddingLeft: 2 }}>
//                     <Typography variant='body2'>{text}</Typography>
//                   </ListItem>
//                 ))}
//               </List>
//             )}
//           </Box>
//         </Modal>
//       </div>
//     </>
//   )
// }

// export default InfoPopUp
