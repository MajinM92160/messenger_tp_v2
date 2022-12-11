<?php

namespace App\Controller;

use App\Entity\Message;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;

class MessageController extends AbstractController
{
    #[Route('/api/send/message/{idUserReceiver}', name: 'app_message', methods: ['POST'])]
    public function createMessage(Request $request, UserRepository $userRepository, int $idUserReceiver, EntityManagerInterface $entityManager, HubInterface $hub)
    {
        $content = json_decode($request->getContent(), true);
        $userSender = $this->getUser();
        $userReceiver = $userRepository->find($idUserReceiver);
        $message = new Message();
        $message->setUserSender($userSender);
        $message->setUserReceiver($userReceiver);
        $message->setContent($content['message']);

        $entityManager->persist($message);
        $entityManager->flush();

        $key1 = sprintf('/message_%s_%s', $userSender->getId(), $userReceiver->getId());
        $key2 = sprintf('/message_%s_%s', $userReceiver->getId(), $userSender->getId());

        $update = new Update(
            [
               $key1,$key2
            ],
            json_encode(['id' => $message->getId(), 'sender' => $userSender->getId(), 'receiver' => $userReceiver->getId(), 'content' => $message->getContent()], true)
        );

        $hub->publish($update);

        return new JsonResponse(['OK'], 201);
    }

    #[Route('/api/get/message/{idUserReceiver}', name: 'app_get_message', methods: ['GET'])]
    public function getMessage(MessageRepository $messageRepository, int $idUserReceiver)
    {
        $userSender = $this->getUser();
        $message = $messageRepository->getMessage($userSender->getId(), $idUserReceiver);

        return new JsonResponse($message);
    }
}