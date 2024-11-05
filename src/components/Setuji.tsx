import Image from 'next/image'

import setuji from '../assets/setuji.webp'

const Setuji = ({message}:{message: string|null}) => {
  return (
    <div className="w-full flex flex-col gap-4 mt-8 items-center justify-center">
        <Image src={setuji} alt="setuji" height={300}/>
        <p className="text-2xl text-primary">{message??"Nothing here!"}</p>
    </div>
  )
}

export default Setuji
