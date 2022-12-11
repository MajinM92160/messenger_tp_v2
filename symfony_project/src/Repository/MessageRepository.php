<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function getMessage($idSender, $idReceiver): array
    {
        return $this->createQueryBuilder('m')
            ->select(['m.id', 'm.content', 'us.id as sender', 'ur.id as receiver'])
            ->leftJoin('m.userReceiver','ur')
            ->leftJoin('m.userSender', 'us')
            ->where('m.userReceiver = :idReceiver OR m.userReceiver = :idSender')
            ->andWhere('m.userSender = :idSender OR m.userSender = :idReceiver')
            ->setParameter('idReceiver', $idReceiver)
            ->setParameter('idSender', $idSender)
            ->getQuery()
            ->getArrayResult();
    }

    // /**
    //  * @return Message[] Returns an array of Message objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Message
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
